import { parseNumber } from '../utils/parsers';

interface NewOutput {
  status: number;
  result: string;
}

const toNewOutput = (body: any): NewOutput => {
  const newOutput: NewOutput = {
    status: parseNumber(body.status),
    result: (body.result),
  };

  return newOutput;
};

export { NewOutput, toNewOutput };