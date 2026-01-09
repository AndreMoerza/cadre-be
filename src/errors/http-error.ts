export class AnyError extends Error {
  constructor(props) {
    super(props);
    this.name = 'AnyError';
  }
}

export class InternalAPIError extends Error {
  constructor(props: { status: number; message?: string }) {
    super(props.message);
    this.name = 'InternalAPIError';
  }
}
