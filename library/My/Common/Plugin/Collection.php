<?php
namespace My\Common\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use My\Common\MongoCollection;
use My\Common\Model\Mongo;

class Collection extends AbstractPlugin
{

    /**
     * 初始化插件并执行初始化集合调用
     *
     * @param string $modelName            
     * @return \My\Common\MongoCollection
     */
    public function __invoke($collection = null, $database = DEFAULT_DATABASE, $cluster = DEFAULT_CLUSTER, $collectionOptions = null)
    {
        if ($collection === null)
            return $this;
        
        return $this->collection($collection, $database, $cluster, $collectionOptions);
    }

    /**
     * 初始化集合调用
     *
     * @param string $collection            
     * @param string $database            
     * @param string $cluster            
     * @param string $collectionOptions            
     * @throws \Exception
     * @return \My\Common\MongoCollection
     */
    public function collection($collection = null, $database = DEFAULT_DATABASE, $cluster = DEFAULT_CLUSTER, $collectionOptions = null)
    {
        if ($collection === null)
            throw new \Exception('请设定集合名称');
        
        $mongoConfig = $this->getController()
            ->getServiceLocator()
            ->get('mongos');
        
        return new MongoCollection($mongoConfig, $collection, $database, $cluster, $collectionOptions);
    }

    /**
     * 初始化集合并通过复制集来获取数据
     *
     * @param string $collection            
     * @param string $database            
     * @param string $cluster            
     * @param string $collectionOptions            
     * @throws \Exception
     * @return \My\Common\MongoCollection
     */
    public function secondary($collection = null, $database = DEFAULT_DATABASE, $cluster = DEFAULT_CLUSTER, $collectionOptions = null)
    {
        if ($collection === null)
            throw new \Exception('请设定集合名称');
        
        $mongoConfig = $this->getController()
            ->getServiceLocator()
            ->get('mongos');
        
        $obj = new MongoCollection($mongoConfig, $collection, $database, $cluster, $collectionOptions);
        $obj->setReadPreference(\MongoClient::RP_SECONDARY);
        return $obj;
    }

    /**
     * 最快速写入模式,读取从集群，写入不等待返回错误
     *
     * @param string $collection            
     * @param string $database            
     * @param string $cluster            
     * @param string $collectionOptions            
     * @return \My\Common\MongoCollection
     */
    public function qw($collection = null, $database = DEFAULT_DATABASE, $cluster = DEFAULT_CLUSTER, $collectionOptions = null)
    {
        if ($collection === null)
            throw new \Exception('请设定集合名称');
        
        $mongoConfig = $this->getController()
            ->getServiceLocator()
            ->get('mongos');
        
        $obj = new MongoCollection($mongoConfig, $collection, $database, $cluster, $collectionOptions);
        $obj->setReadPreference(\MongoClient::RP_SECONDARY);
        if (method_exists($obj, 'setWriteConcern')) {
            $obj->setWriteConcern(0);
        } else {
            $obj->w = 0;
        }
        return $obj;
    }
}



