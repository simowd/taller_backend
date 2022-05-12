const socketLogger = (message: string): void => {
  const start = 'Socket.IO :: ';
  console.log(start, message);
};

export { socketLogger };