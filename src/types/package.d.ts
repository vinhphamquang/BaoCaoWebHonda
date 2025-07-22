declare module '*/package.json' {
  interface PackageJson {
    name: string;
    version: string;
    description?: string;
    main?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: unknown;
  }
  
  const packageJson: PackageJson;
  export = packageJson;
}
