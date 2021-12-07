export default function uriencoded<Args, Result>(
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(arg1: object, ...rest: Args[]) => Result>
): TypedPropertyDescriptor<(arg1: object, ...rest: Args[]) => Result> {
  const originalMethod = descriptor.value;
  descriptor.value = function (arg1: object, ...args: any[]) {
    const encodedParams = Object.keys(arg1).reduce((obj, key) => {
      obj[key] = encodeURIComponent(arg1[key]);
      return obj;
    }, {});
    return originalMethod.apply(this, [encodedParams, ...args]);
  };
  return descriptor;
}
