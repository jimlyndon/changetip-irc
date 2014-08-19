# ChangeTip IRC Bot

Bring the ChangeTip tipping functionality to IRC!
Proof of concept, and the API calls are stubbed.  Accepting pull requests, in particular for securely indentifying a tipper in an irc channel (which is the real meat of any tip bot).  =)


## Install and Run

* Clone the repo

    ```sh
    $ git clone git@github.com:jimlyndon/changetip-irc.git
    ```

* Install [Node](http://http://nodejs.org/)

* Install dependencies in working directory:

    ```sh
    $ cd changetip-irc
    $ [sudo] npm install
    ```

* Start server, passing credentials to it

    ```sh
    $ CT_USER=ChangeTip CT_CRED=??? node server.js
    ```

## RESTful API

* A small amount on stateful data maintained in memory is queryable:

    ```sh
    $ curl http://localhost:3333/networks/3/channels/25
    ```

## Streaming API

* TODO?: perhaps provide websocket event listening for say, chat room mentions, priv messages, etc., anything that we don't want to keep in memory but may want to provide to a client. 

## Run Tests

* Use Make to run all the tests

    ```sh
    $ make test
    ```

* Or you can be specific with mocha directly:

    ```sh
    $ mocha test/api/routes.js
    ```

## History

For detailed changelog, check [Releases](https://github.com/jimlyndon/changetip-irc/releases).
