//String parser
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (content: unknown, key?: string | undefined): string => {
  if (!content || !isString(content)) {
    throw new Error('On property [' + key +']. Incorrect or missing string: ' + content);
  }
  return content;
};

//Number parser
const isNumber = (number: unknown): number is number => {
  const stringNumber = String(number);
  const parsedNumber: number = parseInt(stringNumber);
  return typeof parsedNumber === 'number';
};

const parseNumber = (content: unknown , key?: string | undefined): number => {
  if (content === undefined|| !isNumber(content)) {
    throw new Error('On property [' + key +']. Incorrect or missing number ' + content);
  }
  const stringNumber = String(content);
  const parsedNumber: number = parseInt(stringNumber);
  return parsedNumber;
};

//Date parser
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown , key?: string | undefined): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('On property [' + key +'].Incorrect or missing date: ' + date);
  }
  return date;
};

export { parseString, parseNumber, parseDate };