import React from "react";

import "./Form.css";

function FormField({ children }: { children: React.ReactNode }) {
  return <div className="form__field">{children}</div>;
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return <span className="form__label">{children}</span>;
}

function FormRoot({ children }: { children: React.ReactNode }) {
  return <form className="form">{children}</form>;
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="form__grid">{children}</div>;
}

function FormSeparator() {
  return <div className="form__separator" />;
}

function FormSection({ children }: { children: React.ReactNode }) {
  return <div className="form__section">{children}</div>;
}

function FormSectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="form__section-title">{children}</h3>;
}

const Form = Object.assign(FormRoot, {
  Field: FormField,
  Label: FormLabel,
  Grid: FormGrid,
  Separator: FormSeparator,
  Section: FormSection,
  SectionTitle: FormSectionTitle,
});

export default Form;
