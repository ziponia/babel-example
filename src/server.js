import Koa from "koa";

class Server {
  start() {
    const app = new Koa();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server Running At PORT ${PORT}`));
  }
}

export default Server;
