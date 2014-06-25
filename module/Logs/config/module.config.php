<?php
return array(
    'Logs' => array(
        'LogMongodbService' => array(
            'name' => 'default',
            'handlers' => array(
                'default' => array(
                    'name' => 'Monolog\Handler\MongoDBHandler',
                    'args' => array(
                        'mongo' => new \MongoClient("mongodb://CentOS6-64.Master:27017"),
                        'database' => 'logs',
                        'collection' => 'logs' . date("Ym"),
                        'level' => \Monolog\Logger::ERROR,
                        'bubble' => true
                    )
                )
            )
        )
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Logs\Service\MonologServiceAbstractFactory'
        )
    )
);