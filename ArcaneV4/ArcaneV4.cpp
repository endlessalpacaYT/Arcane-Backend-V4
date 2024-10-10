#include <iostream>
#include <thread>
#include <future>
#include "crow.h"
#include <boost/asio.hpp>

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

    CROW_ROUTE(app, "/")([]() {
        return "ArcaneBackendV4";
    });

    app.port(port).multithreaded().run();
}