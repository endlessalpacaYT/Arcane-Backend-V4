#include <iostream>
#include "crow.h"
#include <boost/asio.hpp>

int startHTTPServer(int port);

int main()
{
    std::cout << "ArcaneV4 Is Starting!\n";
    startHTTPServer(3551);
    return 0;
}

int startHTTPServer(int port) {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([]() {
        return "ArcaneBackendV4";
    });

    std::cout << "ArcaneV4 Running On Port: " << port << "\n";
    app.port(port).multithreaded().run();
    return 0;
}