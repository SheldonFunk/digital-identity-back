#Manitoba Central Citizen app

This repo contains backend code to run the Manitoba Central Citizen proof of concept (PoC). The project based on the BC Gov Issuer kit. The PoC includes:

- A Manitoba Central Citizen application that issues verifiable credential tier 1,2,3
- A Covid application that allows user to login and claim the benefit with the issued credential from Manitoba Central Citizen
- A API Backend to handle request to issue revocable credential, revoke credential, proof request and verify

## Pre-Requisites

- [Docker](https://www.docker.com/products/docker-desktop)

- [s2i](https://github.com/openshift/source-to-image/releases)

- [jq](https://stedolan.github.io/jq)

- [von-network](https://github.com/]/von-network)
- [frontend](https://gitlab.intranet.mbgov.ca/DPescadorL/digital-identity-front)
- [console wallet](https://github.com/hyperledger/aries-cloudagent-python)
`jq` and `ngrok` are available on package manager systems for different platforms such as [Homebrew](https://brew.sh/) (Mac), [Chocolatey](https://chocolatey.org/) (Windows) and various Linux distribution package managers.

## Running the POC

Build and Start the von-network at port 9000 with the following command:

`docker/manage build`
`docker/manage start --logs`


Start the api backend at port 5000 with the following command:

`TAG=default docker/manage start-demo`

Caution: you should replace the `default` by another value whenever you clear/reset/restart the container (please refer to the restart section below), because this value will be a part of the credential definition and the credential definition could not be recovered.

Build and Start the frontend of the MBCC app at default port 4200:
`cd digital-identity-front/mbcc-app`
`npm install`
`ng serve --host mbawks5121 --port 4200`

Build and Start the frontend of the covid app at port 4800:
`cd digital-identity-front/covid-app`
`npm install`
`ng serve --host mbawks5121 --port 4800`

Build and Start the Alice with her console wallet:
`cd aries-cloudagent-python/demo`
`./run_demo alice --event`

At the first time running, we need to register the schema before making any credential definition on the von-network. To do this, we need to edit the schema at
`api/config/schemas.json` as follow:
```
[
    {
        "id": <did>:2:<schema_name>:<schema_version>
        "default": true
    },
    {
        "schema_name": <schema_name>,
        "schema_version": <schema_version>,
        "attributes": [
            "field1",
            "field2"
        ]
    }
]
    
```
### Troubleshooting

1) I could not run the von-network in my local, I get the error message like: no module named server.server

You should comment out these 2 lines in your docker-compose.yml:
```
  webserver:
    image:...
    command:...
    enviroment:...
    networks:...
    ports:...
    volumes:
    #  - ./config:/home/indy/config
    # - ./server:/home/indy/server
      - webserver-cli:/home/indy/.indy-cli
      - webserver-ledger:/home/indy/ledger
```

To restart the applications:

- In the second terminal, hit Ctrl-C and then:
  - run `./manage stop` to stop the apps so you can update the code and restart by rerunning the `./manage` commands above. 

- To stop and delete the storage for the apps:
  - In the second terminal, hit Ctrl-C and run `./manage down`


## Credential Schema

Each api/controller can issue several credentials matching different schemas: the schema definitions that can be processed by the api/controller are described in [this file](api/config/schemas.json). There are two ways of defining a schema: using the `id` of the schema on the target ledger or, alternatively, defining the `schema_name`, `schema_version` and `attributes` for the schema. Additionally, ***one schema in the provided list must be marked with the `default: true` property***: this describes which schema will be used if no explicit request is forwarded to the api/controller.

When using Issuer Kit in demo mode the api/controller will use the schema marked as default, which corresponds to the schema definition that was published to the Von Network Ledger , and issue credentials that match that definition. In most cases updating the schema definition should not be necessary, however if this was the case the following steps will be required to instruct the controller/agent to publish a new schema definition on the target ledger, and use it:

- update the schema definition(s) in [schemas.json](api/config/schemas.json) using the desired fields.

