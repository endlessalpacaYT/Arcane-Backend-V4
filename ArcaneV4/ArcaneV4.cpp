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

    defineRoutes(app);

    app.port(port).multithreaded().run();
}