import app from './app';
import transactionRouter from './routes/transactions.routes';

app.use(transactionRouter);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
