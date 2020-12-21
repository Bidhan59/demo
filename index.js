const startApp = require("./app");
const logger = require("./logger").logger("exalogico");

const PORT = 4086;

startApp().then((app) => {
  app.listen(PORT, () => {
    logger.appLogger.info(`Shopping site listening  on the port ${PORT}`);
  });
});
