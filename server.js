const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body').default;
const cors = require('@koa/cors');

const app = new Koa();

app.use(cors());

const tickets = [
  {
    id: 1,
    name: 'Пpотопланетное облако',
    description: 'Радиант слабопроницаем. После того как тема сформулирована, надир гасит первоначальный восход .',
    status: false,
    created: 1519211809934
  },
  {
    id: 2,
    name: 'Эфемерида колеблет',
    description: 'Все известные астероиды имеют прямое движение, при этом отвесная линия решает первоначальный спектральный класс. Эфемерида колеблет эффективный диаметp.',
    status: false,
    created: 1519211809934
  },
  {
    id: 3,
    name: 'Зоркость наблюдателя',
    description: 'Скоpость кометы в пеpигелии вероятна. Широта выбирает близкий Тукан – у таких объектов рукава столь фрагментарны и обрывочны, что их уже нельзя назвать спиральными.',
    status: false,
    created: 1519211809934
  },
]

app.use(koaBody({
  urlencoded: true,
}));

app.use((ctx, next) => {
  if(ctx.request.method !== 'OPTIONS') {
    next();

    return;
  }

  ctx.response.status = 204;

})

app.use( async ctx => {

  const { method } = ctx.request.query;

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;

    case 'createTicket':
      ctx.response.body = 'ok';
      newTicket(ctx.request.body);
      return;

    case 'doneTicket':
      doneTicket(ctx.request.body.id);
      ctx.response.body = 'ok';
      return

    case 'removeTicket':
      removeTicket(ctx.request.body.id);
      ctx.response.body = 'ok';
      return

    case 'updateTicket':
      ctx.response.body = 'ok';
      updateTicket(ctx.request.body);
      return

    case 'ticketById':
      const description = getFull(ctx.request.query.id);
      ctx.response.body = {text: description};
      return

    default:
      ctx.response.status = 404;
      return;
  }
});


const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
});

let uniqueId = 4;
function newUniqueId() {
  return uniqueId++;
}

function newTicket(obj) {

  const time = new Date();

  const newTicket = {
    id: newUniqueId(),
    name: obj.name,
    description: obj.description,
    status: false,
    created: time
  }

  tickets.unshift(newTicket);

}

function updateTicket(obj) {

  const ticketId = tickets.findIndex(item => item.id == obj.id);
  tickets[ticketId].name = obj.name;
  tickets[ticketId].description = obj.description;
  console.log(ticketId);
  console.log(obj.name);
  console.log(obj.description);

}

function doneTicket(id) {
  const ticketId = tickets.findIndex(item => item.id == id);
  const ticket = tickets[ticketId];
  ticket.status = true;
  tickets.splice(ticketId, 1);
  tickets.push(ticket);
}

function removeTicket(id) {
  const ticketId = tickets.findIndex(item => item.id == id);
  tickets.splice(ticketId, 1);
}

function getFull(id) {
  const ticket = tickets.find(item => item.id == id);
  return ticket.description;
}