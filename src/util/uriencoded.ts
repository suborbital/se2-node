export default function uriencoded(
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (arg1: any, ...args: any[]) {
    if (typeof arg1 == "object") {
      const encodedParams = Object.keys(arg1).reduce((obj, key) => {
        obj[key] = encodeURIComponent(arg1[key]);
        return obj;
      }, {});
      return originalMethod.apply(this, [encodedParams, ...args]);
    } else {
      return originalMethod.apply(this, args);
    }
  };
  return descriptor;
}
