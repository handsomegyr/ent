<?php
use Project\Model\Plugin;
return array(
    'router' => array(
        'routes' => array(
            'project' => array(
                'type' => 'Literal',
                'options' => array(
                    'route' => '/project',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Project\Controller',
                        'controller' => 'Project',
                        'action' => 'index'
                    )
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type' => 'Zend\Mvc\Router\Http\Segment',
                        'options' => array(
                            'route' => '/[:controller[/:action]]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*'
                            ),
                            'defaults' => array()
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(
                            'Wildcard' => array(
                                'type' => 'Zend\Mvc\Router\Http\Wildcard',
                                'may_terminate' => true
                            )
                        )
                    )
                )
            )
        )
    ),
    'console' => array(
        'router' => array(
            'routes' => array(
                'run-statistics' => array(
                    'options' => array(
                        'route' => 'dashboard run',
                        'defaults' => array(
                            'controller' => 'Project\Controller\Dashboard',
                            'action' => 'run'
                        )
                    )
                )
            )
        )
    ),
    'service_manager' => array()
);
