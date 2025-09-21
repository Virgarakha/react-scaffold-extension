export interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface CrudTemplateOptions {
  name: string;
  lowerName: string;
  theme: 'dark' | 'light';
}

export interface AuthTemplateOptions {
  theme: 'dark' | 'light';
}

export type ThemeOption = 'dark' | 'light';