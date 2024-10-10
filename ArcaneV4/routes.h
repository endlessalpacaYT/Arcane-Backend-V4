#include <iostream>
#include "crow.h"

void mainRoutes(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/")([]() {
        crow::json::wvalue response;
        response["message"] = "ArcaneBackendV4";
        response["status"] = "success";
        response["code"] = 200;

        return response;
    });
}

void defineRoutes(crow::SimpleApp& app) {
    mainRoutes(app);
}