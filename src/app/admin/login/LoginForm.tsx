"use client";

import { login } from "@/app/admin/actions";
import { AdminForm, Field, inputClass } from "@/components/admin/ui";

export function LoginForm() {
  return (
    <AdminForm action={login} submitLabel="Masuk">
      <Field label="Email">
        <input name="email" type="email" required autoComplete="username" className={inputClass} />
      </Field>
      <Field label="Password">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>
    </AdminForm>
  );
}
