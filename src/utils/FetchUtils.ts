/**
 * Polling mechanism for refetching data
 * @param queryFn Query function
 * @param interval Time interval by milliseconds, default is 1000ms
 * @param maxCount maximum interval count, default is 10
 * @returns result of the queryFn
 */
function polling<T = any>(
  queryFn: () => Promise<T>,
  option: {
    interval: number;
    maxCount?: number;
    onError?: (error: any) => void;
  } = {
    interval: 1000,
    maxCount: 10,
    onError: () => {},
  }
): Promise<T> {
  let count: number = 0;
  return new Promise<T>((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const result: Awaited<T> = await queryFn();
        resolve(result);
        clearInterval(timer);
      } catch (error) {
        option.onError?.(error);
        if (option.maxCount && count >= option.maxCount) {
          reject(error);
          clearInterval(timer);
        }
        count++;
      }
    }, option.interval);
  });
}

export default {
  polling,
};
