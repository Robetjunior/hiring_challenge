export class NotFoundError extends Error {
  public static readonly httpStatusCode = 404;

  constructor(message?: string) {
    super(message ?? "Recurso não encontrado");
    this.name = "NotFoundError";
    // necessário para manter instanceof funcionando após transpilar para ES5
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
