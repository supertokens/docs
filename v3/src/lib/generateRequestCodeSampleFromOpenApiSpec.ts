abstract class RequestCodeSampleGenerator {
  constructor(spec: Record<string, unknown>) {}

  get coreApiDomain() {}

  get coreApiKey() {}

  get backendApiDomain() {}

  get backendApiBasePath() {}

  abstract render(path: string): string {}
}

export class NodeRequestCodeSampleGenerator extends RequestCodeSampleGenerator {
  constructor(spec: Record<string, unknown>) {
    super(spec);
  }

  render(path: string): string {}
}
