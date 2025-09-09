#!/usr/bin/env python3

import os
import sys
import json
import shutil
import subprocess
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

try:
    from pydoc_markdown import PydocMarkdown
    from pydoc_markdown.interfaces import Context
    from pydoc_markdown.contrib.loaders.python import PythonLoader
    from pydoc_markdown.contrib.renderers.markdown import MarkdownRenderer
    from pydoc_markdown.contrib.processors.filter import FilterProcessor
    from pydoc_markdown.contrib.processors.smart import SmartProcessor
    from pydoc_markdown.contrib.processors.crossref import CrossrefProcessor
except ImportError:
    print("Installing pydoc-markdown...")
    subprocess.check_call([sys.executable, "-m", "pip",
                          "install", "pydoc-markdown"])
    from pydoc_markdown import PydocMarkdown
    from pydoc_markdown.interfaces import Context
    from pydoc_markdown.contrib.loaders.python import PythonLoader
    from pydoc_markdown.contrib.renderers.markdown import MarkdownRenderer
    from pydoc_markdown.contrib.processors.filter import FilterProcessor
    from pydoc_markdown.contrib.processors.smart import SmartProcessor
    from pydoc_markdown.contrib.processors.crossref import CrossrefProcessor


@dataclass
class ModuleConfig:
    path: str
    title: str
    sidebar_position: int
    package_name: str
    generated_file_path: str
    sub_modules: Optional[List[str]] = None


@dataclass
class PythonRepository:
    url: str
    version: str
    modules: List[ModuleConfig]
    output_dir: str
    name: str
    language: str
    category_json: Dict[str, Any]
    package_name: str


class PythonDocGenerator:
    def __init__(self, tmp_dir: str = "./tmp"):
        self.tmp_dir = Path(tmp_dir)
        self.tmp_dir.mkdir(exist_ok=True)

    def clone_repository(self, repository: PythonRepository, branch: str) -> Path:
        """Clone a repository to the tmp directory."""
        repo_path = self.tmp_dir / repository.name

        if repo_path.exists():
            shutil.rmtree(repo_path)

        print(f"Cloning {repository.url}")
        subprocess.run([
            "git", "clone", repository.url,
            "-b", branch,
            str(repo_path),
            "--depth", "1"
        ], check=True)

        return repo_path

    def generate_module_documentation(self, module: ModuleConfig, repo_path: Path,
                                      package_name: str, output_dir: Path, repository: PythonRepository) -> None:
        """Generate documentation for a single module."""
        try:
            print(f"Generating documentation for {module.package_name}...")

            # Setup context
            context = Context(directory=str(repo_path))

            # Configure loader
            loader = PythonLoader(search_path=["."])
            module_path = module.path.replace("/", ".")

            # Handle special case for __init__ module
            if module_path == "__init__":
                full_module_name = package_name
            else:
                full_module_name = f"{package_name}.{module_path}"

            loader.modules = [full_module_name]

            # Configure processors
            filter_processor = FilterProcessor()
            # Filter out private members and common typing imports
            filter_processor.expression = "not name.startswith('_') and not (name in ['Any', 'Callable', 'Dict', 'List', 'Optional', 'Literal', 'Union', 'TYPE_CHECKING', 'annotations', 'override']) and not (hasattr(obj, '__module__') and obj.__module__ and obj.__module__ in ['typing', 'builtins', '__future__'])"
            filter_processor.skip_empty_modules = True

            smart_processor = SmartProcessor()
            crossref_processor = CrossrefProcessor()

            # Configure renderer
            renderer = MarkdownRenderer()
            renderer.descriptive_class_title = False
            renderer.descriptive_module_title = False
            renderer.add_source_link = True
            renderer.add_member_class_prefix = True
            renderer.render_toc = False
            renderer.render_module_header = False
            # Source links are enabled via add_source_link = True

            # Initialize components
            loader.init(context)
            filter_processor.init(context)
            smart_processor.init(context)
            crossref_processor.init(context)
            renderer.init(context)

            modules = list(loader.load())
            print(f"Loaded {len(modules)} modules for {full_module_name}")

            if not modules:
                raise Exception(f"No modules found for {full_module_name}")

            filter_result = filter_processor.process(modules, resolver=None)
            if filter_result is not None:
                modules = list(filter_result)

            smart_result = smart_processor.process(modules, resolver=None)
            if smart_result is not None:
                modules = list(smart_result)

            crossref_result = crossref_processor.process(
                modules, resolver=None)
            if crossref_result is not None:
                modules = list(crossref_result)

            main_content = renderer.render_to_string(modules)

            # Handle submodules
            submodule_content = ""
            if module.sub_modules:
                for sub_module in module.sub_modules:
                    try:
                        sub_loader = PythonLoader(search_path=["."])
                        sub_module_path = f"{module_path}.{sub_module}"
                        sub_full_module_name = f"{package_name}.{sub_module_path}"
                        sub_loader.modules = [sub_full_module_name]
                        sub_loader.init(context)

                        sub_modules = list(sub_loader.load())
                        if sub_modules:
                            sub_processed = sub_modules

                            # Apply processors to submodules
                            filter_result = filter_processor.process(
                                sub_processed, resolver=None)
                            if filter_result is not None:
                                sub_processed = list(filter_result)

                            smart_result = smart_processor.process(
                                sub_processed, resolver=None)
                            if smart_result is not None:
                                sub_processed = list(smart_result)

                            crossref_result = crossref_processor.process(
                                sub_processed, resolver=None)
                            if crossref_result is not None:
                                sub_processed = list(crossref_result)

                            submodule_content += f"\n\n## {sub_module}\n\n"
                            submodule_content += f"```python\nfrom {package_name}.{sub_module_path} import *\n```\n\n"
                            submodule_content += renderer.render_to_string(
                                sub_processed)
                    except Exception as e:
                        print(f"Warning: Failed to generate docs for submodule {sub_module}: {e}")

            # Create final markdown with frontmatter
            if module_path == "__init__":
                import_statement = f"import {package_name}"
            else:
                import_statement = f"from {package_name}.{module_path} import *"

            markdown_content = f"""---
title: "{module.title}"
sidebar_position: {module.sidebar_position}
---

# {module.title}

```python
{import_statement}
```

{main_content}{submodule_content}
"""

            # Write to file
            output_file = output_dir / module.generated_file_path
            output_file.parent.mkdir(parents=True, exist_ok=True)
            output_file.write_text(markdown_content)

            print(f"Generated documentation for {module.package_name}")

        except Exception as e:
            print(f"Error generating documentation for {module.package_name}: {e}")
            import traceback
            traceback.print_exc()

    def generate_documentation(self, repository: PythonRepository) -> None:
        """Generate documentation for a repository."""
        # Clone repository
        repo_path = self.clone_repository(repository, f"v{repository.version}")

        # Setup output directory
        output_dir = Path(repository.output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        # Add repository to Python path
        sys.path.insert(0, str(repo_path))

        try:
            # Generate documentation for each module
            for module in repository.modules:
                self.generate_module_documentation(
                    module, repo_path, repository.package_name, output_dir, repository
                )

            # Create category file
            category_file = output_dir / "_category_.json"
            category_file.write_text(json.dumps(
                repository.category_json, indent=2))

        finally:
            # Remove from Python path
            if str(repo_path) in sys.path:
                sys.path.remove(str(repo_path))


def main():
    # Repository configuration
    repositories = [
        PythonRepository(
            url="https://github.com/supertokens/supertokens-python",
            version="0.30.2",
            package_name="supertokens_python",
            output_dir="./docs/references/backend-sdks/supertokens-python",
            name="supertokens-python",
            language="python",
            modules=[
                ModuleConfig(
                    path="__init__",
                    title="SuperTokens Python",
                    sidebar_position=1,
                    package_name="supertokens-python",
                    generated_file_path="index.mdx",
                ),
                ModuleConfig(
                    path="types",
                    title="SuperTokens Python Types",
                    sidebar_position=1,
                    package_name="supertokens-python/types",
                    generated_file_path="types.mdx",
                ),
                ModuleConfig(
                    path="recipe/emailpassword",
                    title="EmailPassword",
                    sidebar_position=2,
                    package_name="supertokens-python/recipe/emailpassword",
                    generated_file_path="recipe.emailpassword.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/passwordless",
                    title="Passwordless",
                    sidebar_position=3,
                    package_name="supertokens-python/recipe/passwordless",
                    generated_file_path="recipe.passwordless.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/thirdparty",
                    title="ThirdParty",
                    sidebar_position=4,
                    package_name="supertokens-python/recipe/thirdparty",
                    generated_file_path="recipe.thirdparty.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/session",
                    title="Session",
                    sidebar_position=5,
                    package_name="supertokens-python/recipe/session",
                    generated_file_path="recipe.session.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/emailverification",
                    title="EmailVerification",
                    sidebar_position=6,
                    package_name="supertokens-python/recipe/emailverification",
                    generated_file_path="recipe.emailverification.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/jwt",
                    title="JWT",
                    sidebar_position=7,
                    package_name="supertokens-python/recipe/jwt",
                    generated_file_path="recipe.jwt.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/userroles",
                    title="UserRoles",
                    sidebar_position=8,
                    package_name="supertokens-python/recipe/userroles",
                    generated_file_path="recipe.userroles.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/usermetadata",
                    title="UserMetadata",
                    sidebar_position=9,
                    package_name="supertokens-python/recipe/usermetadata",
                    generated_file_path="recipe.usermetadata.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/dashboard",
                    title="Dashboard",
                    sidebar_position=10,
                    package_name="supertokens-python/recipe/dashboard",
                    generated_file_path="recipe.dashboard.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/multifactorauth",
                    title="MFA",
                    sidebar_position=11,
                    package_name="supertokens-python/recipe/multifactorauth",
                    generated_file_path="recipe.multifactorauth.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/multitenancy",
                    title="MultiTenancy",
                    sidebar_position=12,
                    package_name="supertokens-python/recipe/multitenancy",
                    generated_file_path="recipe.multitenancy.mdx",
                    sub_modules=["interfaces"],
                ),
                ModuleConfig(
                    path="recipe/totp",
                    title="TOTP",
                    sidebar_position=13,
                    package_name="supertokens-python/recipe/totp",
                    generated_file_path="recipe.totp.mdx",
                    sub_modules=["interfaces"],
                ),
            ],
            category_json={
                "label": "Python SDK Reference",
                "position": 6,
            },
        ),
    ]

    # Generate documentation
    generator = PythonDocGenerator()
    for repository in repositories:
        generator.generate_documentation(repository)


if __name__ == "__main__":
    main()
