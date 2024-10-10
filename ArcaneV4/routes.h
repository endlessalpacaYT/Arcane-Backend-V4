#include "crow.h"

void mainRoutes(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/")([]() {
        return "ArcaneBackendV4";
    });
}

void defineRoutes(crow::SimpleApp& app) {
    mainRoutes(app);
}