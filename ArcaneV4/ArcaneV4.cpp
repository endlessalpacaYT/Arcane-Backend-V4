#include <iostream>
#include <thread>
#include <future>
#include "crow.h"
#include <boost/asio.hpp>
#include "routes.h"

void startHTTPServer(int port);

int main()
{
    int port = 3551;
    std::cout << "ArcaneV4 Is Starting on Port: " << port << "\n";

    auto httpFuture = std::async(std::launch::async, startHTTPServer, port);

    return 0;  
}

void startHTTPServer(int port) {
    crow::SimpleApp app;

    app.loglevel(crow::LogLevel::Warning);

    defineRoutes(app);

    app.route_dynamic("/*").methods("GET"_method, "POST"_method, "PUT"_method, "DELETE"_method)(
        [](const crow::request& req) {
            crow::json::wvalue response;
            response["error"] = "arcane.errors.common.not_found";
            response["error_description"] = "The route you requested is either unavailable or missing!";
            response["code"] = 404;

            std::cout << "404 Not Found: " << req.url << "\n";  
            return crow::response(404, response);
        });

    app.port(port).multithreaded().run();
}