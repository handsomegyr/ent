<?php

/**
 * iDatabase文件处理函数
 *
 * @author young 
 * @version 2014.02.16
 * 
 */
namespace Project\Controller;

use My\Common\Controller\Action;

class IndexController extends Action
{

    private $_file;

    public function init()
    {
        $this->_file = $this->model('Project\Model\File');
    }

    public function index()
    {

    }
}