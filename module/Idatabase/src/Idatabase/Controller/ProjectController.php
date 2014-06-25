<?php
/**
 * iDatabase项目管理
 *
 * @author young 
 * @version 2013.11.11
 * 
 */
namespace Idatabase\Controller;

use Zend\View\Model\JsonModel;
use Zend\Json\Json;
use My\Common\Controller\Action;

class ProjectController extends Action
{

    private $_project;

    private $_acl;

    public function init()
    {
        $this->_project = $this->model('Idatabase\Model\Project');
        $this->_acl = $this->collection(SYSTEM_ACCOUNT_PROJECT_ACL);
        $this->getAcl();
    }

    /**
     * 读取全部项目列表
     *
     * @author young
     * @name 读取全部项目列表
     * @version 2013.11.07 young
     */
    public function indexAction()
    {
        $query = array();
        $isSystem = filter_var($this->params()->fromQuery('isSystem', ''), FILTER_VALIDATE_BOOLEAN);
        $search = $this->params()->fromQuery('query', null);
        if ($search != null) {
            $search = myMongoRegex($search);
            $searchQuery = array(
                '$or' => array(
                    array(
                        'name' => $search
                    ),
                    array(
                        'sn' => $search
                    ),
                    array(
                        'desc' => $search
                    )
                )
            );
            $query['$and'][] = $searchQuery;
        }
        
        $query['$and'][] = array(
            'isSystem' => $isSystem
        );
        
        if (! $_SESSION['acl']['admin']) {
            $query['$and'][] = array(
                '_id' => array(
                    '$in' => myMongoId($_SESSION['acl']['project'])
                )
            );
        }
        
        return $this->findAll(IDATABASE_PROJECTS, $query);
    }

    /**
     * 添加新的项目
     *
     * @author young
     * @name 添加新的项目
     * @version 2013.11.14 young
     * @return JsonModel
     */
    public function addAction()
    {
        $name = $this->params()->fromPost('name', null);
        $sn = $this->params()->fromPost('sn', null);
        $isSystem = filter_var($this->params()->fromPost('isSystem', ''), FILTER_VALIDATE_BOOLEAN);
        $desc = $this->params()->fromPost('desc', null);
        
        if ($name == null) {
            return $this->msg(false, '请填写项目名称');
        }
        
        if ($sn == null) {
            return $this->msg(false, '请填写项目编号');
        }
        
        if ($desc == null) {
            return $this->msg(false, '请填写项目描述');
        }
        
        if ($this->checkProjectNameExist($name)) {
            return $this->msg(false, '项目名称已经存在');
        }
        
        if ($this->checkProjectSnExist($sn)) {
            return $this->msg(false, '项目编号已经存在');
        }
        
        $project = array();
        $project['name'] = $name;
        $project['sn'] = $sn;
        $project['isSystem'] = isset($_SESSION['account']['role']) && $_SESSION['account']['role'] === 'root' ? $isSystem : false;
        $project['desc'] = $desc;
        $this->_project->insert($project);
        
        return $this->msg(true, '添加信息成功');
    }

    /**
     * 编辑新的项目
     *
     * @author young
     * @name 编辑新的项目
     * @version 2013.11.14 young
     * @return JsonModel
     */
    public function editAction()
    {
        $_id = $this->params()->fromPost('_id', null);
        $name = $this->params()->fromPost('name', null);
        $sn = $this->params()->fromPost('sn', null);
        $isSystem = filter_var($this->params()->fromPost('isSystem', ''), FILTER_VALIDATE_BOOLEAN);
        $desc = $this->params()->fromPost('desc', null);
        
        if ($_id == null) {
            return $this->msg(false, '无效的项目编号');
        }
        
        if ($name == null) {
            return $this->msg(false, '请填写项目名称');
        }
        
        if ($sn == null) {
            return $this->msg(false, '请填写项目编号');
        }
        
        if ($desc == null) {
            return $this->msg(false, '请填写项目描述');
        }
        
        $oldProjectInfo = $this->_project->findOne(array(
            '_id' => myMongoId($_id)
        ));
        
        if ($this->checkProjectNameExist($name) && $oldProjectInfo['name'] != $name) {
            return $this->msg(false, '项目名称已经存在');
        }
        
        if ($this->checkProjectSnExist($sn) && $oldProjectInfo['sn'] != $sn) {
            return $this->msg(false, '项目编号已经存在');
        }
        
        $project = array();
        $project['name'] = $name;
        $project['sn'] = $sn;
        $project['isSystem'] = isset($_SESSION['account']['role']) && $_SESSION['account']['role'] === 'root' ? $isSystem : false;
        $project['desc'] = $desc;
        $this->_project->update(array(
            '_id' => myMongoId($_id)
        ), array(
            '$set' => $project
        ));
        
        return $this->msg(true, '编辑信息成功');
    }

    /**
     * 删除新的项目
     *
     * @author young
     * @name 删除新的项目
     * @version 2013.11.14 young
     * @return JsonModel
     */
    public function removeAction()
    {
        $_id = $this->params()->fromPost('_id', null);
        try {
            $_id = Json::decode($_id, Json::TYPE_ARRAY);
        } catch (\Exception $e) {
            return $this->msg(false, '无效的json字符串');
        }
        
        if (! is_array($_id)) {
            return $this->msg(false, '请选择你要删除的项');
        }
        foreach ($_id as $row) {
            $this->_project->remove(array(
                '_id' => myMongoId($row)
            ));
        }
        return $this->msg(true, '删除信息成功');
    }

    /**
     * 获取某项目信息和她下的所有collection列表，并且以树的方式展现
     *
     * @author young
     * @name 获取某项目信息和她下的所有collection列表，并且以树的方式展现
     * @version 2013.11.14 young
     * @return JsonModel
     */
    public function treeAction()
    {
        $accountInfo = null;
        $projectId = $this->params()->fromQuery("projectId", '');
        $checked = intval($this->params()->fromQuery("checked", 0));
        $expanded = intval($this->params()->fromQuery("expanded", 0));
        $editabled = intval($this->params()->fromQuery("editabled", 1));
        $viewexcluded = intval($this->params()->fromQuery("viewexcluded", 0));
        $query = array();
        if (! empty($projectId)) {
            $query['_id'] = myMongoId($projectId);
        }
        $items = $this->getProjectItems(array(), $query, $checked, $expanded, $editabled, $viewexcluded);
        $datas = array_values($items);
        return new JsonModel($datas);
    }

    /**
     * 验证关联表是否正确
     */
    public function checkCloneAction()
    {
        $projectId = $this->params()->fromQuery("projectId", '');
        $targetProjectId = $this->params()->fromQuery("targetProjectId", '');
        // 获取复制项目表
        $source_formIds = $this->params()->fromQuery('forms', array());
        // 是否复制数据
        $isCopyData = intval($this->params()->fromQuery("isCopyData", 0));
        
        // 是否是同一个数据库
        $isSameProject = ($projectId == $targetProjectId);
        
        // 复制数据 并且是不同的数据库之间
        if (! $isSameProject && $isCopyData) {
            $associationFormId = $collection->isLackOfAssociationForm($source_formIds); // 获得视图关联表ID
                                                                                                  // 是否缺乏视图关联表
            if ($associationFormId) {
                $rshFormInfo = $collection->findOne(array(
                    '_id' => new MongoId($associationFormId)
                ));
                exit(json_encode(array(
                    'success' => false,
                    'msg' => '缺乏视图关联表：' . $rshFormInfo['name']
                )));
            }
            
            $rshFormId = $this->_iDatabaseStructure->isLackOfRshForm($source_formIds); // 获得关联表ID
                                                                                       // 是否缺乏关联表
            if ($rshFormId) {
                $rshFormInfo = $collection->findOne(array(
                    '_id' => new MongoId($rshFormId)
                ));
                exit(json_encode(array(
                    'success' => false,
                    'msg' => '缺乏关联的信息表：' . $rshFormInfo['name']
                )));
            } else
                exit(json_encode(array(
                    'success' => true,
                    'msg' => $isCopyData . $projectId . $targetProjectId
                )));
        } else {
            return $this->msg(true, $isCopyData . $projectId . $targetProjectId);
        }
    }

    /**
     * 复制一个项目
     */
    public function cloneAction()
    {
        try {
            $projectId = $this->params()->fromQuery("projectId", '');
            $targetProjectId = $this->params()->fromQuery("targetProjectId", '');
            // 获取复制项目表
            $source_formIds = $this->params()->fromQuery('forms', array());
            // 是否复制数据
            $isCopyData = intval($this->params()->fromQuery("isCopyData", 0));
            
            // 是否是同一个数据库
            $isSameProject = ($projectId == $targetProjectId);
            
            if (! empty($projectId)) {
                $projectInfo = $this->_project->findOne(array(
                    '_id' => myMongoId($projectId)
                ));
                if (empty($projectInfo)) {
                    return $this->msg(false, '源项目不存在，无法复制');
                }
                $checkProject = $this->_project->findOne(array(
                    '_id' => myMongoId($targetProjectId)
                ));
                if (empty($checkProject)) {
                    return $this->msg(false, '目标项目不存在，无法复制');
                }
                resetTimeMemLimit();
                
                // 获取该项目下的所有表,循环复制
                $formIds = array();
                $query = array();
                $query['projectId'] = $projectId;
                if (count($source_formIds) > 0) {
                    foreach ($source_formIds as $k => &$v) {
                        $v = myMongoId($v);
                    }
                }
                $query['_id'] = array(
                    '$in' => $source_formIds
                );
                $collection = $this->model('Idatabase\Model\Collection');
                $cursor = $collection->find($query);
                while ($cursor->hasNext()) {
                    $formInfo = $cursor->getNext();
                    // 复制表
                    $newFormInfo = $this->cloneForm($targetProjectId, $formInfo, $isCopyData);
                    // 返回旧表的ID和新表ID的对应数组
                    $formIds[$formInfo['_id']->__toString()] = $newFormInfo['newFormID'];
                }
                // 更新结构表的外键关联信息及数据关系
                $this->updateRshDataForm($formIds);
                
                return $this->msg(true, '复制项目成功');
            } else {
                return $this->msg(false, '请提交你要复制的项目');                
            }
        } catch (\Exception $e) {
            $exceptMsg = exceptionMsg($e);
            return $this->msg(false, $exceptMsg);
        }
    }
    
    /**
     * 复制一个表
     */
    private function cloneForm($targetProjectId, $formInfo, $isCopyData = 0)
    {
        $recordMap = new Admin_Model_iDatabase_RecordMap();
        $uniqid = uniqid();
        $datas = array();
        $datas['project_id']  = $targetProjectId;
        $collection = $this->model('Idatabase\Model\Collection');
        
        $check = $collection->count(array(
            'project_id'=>$targetProjectId,
            '$or'=>array(
                array('name' => $formInfo['name']),
                array('alias' => $formInfo['alias'])
            )
        ));
        if($check>0) {
            $datas['alias']  = $formInfo['alias'].'_'.$uniqid;
            $datas['name']   = $formInfo['name'].'_'.$uniqid;
        }
        else {
            $datas['alias']  = $formInfo['alias'];
            $datas['name']   = $formInfo['name'];
        }
    
        $datas['formDesc']   = $formInfo['formDesc'];
        $datas['createTime'] = new MongoDate();
        $datas['del_flag'] = !empty($formInfo['del_flag'])?$formInfo['del_flag']:0;
        $datas['formType'] = !empty($formInfo['formType'])?$formInfo['formType']:'collection';
        $datas['associationForms'] = !empty($formInfo['associationForms'])?$formInfo['associationForms']:array();
        $datas['primaryFormId'] = !empty($formInfo['primaryFormId'])?$formInfo['primaryFormId']:'';
        $collection->insert($datas);
        $formId = $datas['_id']->__toString();
    
        //复制表结构
        $cursor = $this->_iDatabaseStructure->find(array('formId'=>$formInfo['_id']->__toString()));
        while ($cursor->hasNext()) {
            $row = $cursor->getNext();
            $source_id = $row['_id']->__toString();
            unset($row['_id']);
             
            $row['formId']     = $formId;
            $row['createTime'] = new MongoDate();
            $this->_iDatabaseStructure->insert($row);
            $recordMap->recordMap("structure",$source_id, $row['_id']->__toString());
        }
    
        //是否复制数据
        if($isCopyData) {
            $targetRecord = new Admin_Model_iDatabase_Record($formId);
            $_iDatabaseRecord = new Admin_Model_iDatabase_Record($formInfo['_id']->__toString());
            $cursor = $_iDatabaseRecord->find(array());
            while ($cursor->hasNext()) {
                $row = $cursor->getNext();
                $source_id = $row['_id']->__toString();
                unset($row['_id']);
                $row['formId']     = $formId;
                $row['createTime'] = new MongoDate();
                $targetRecord->insert($row);
                $recordMap->recordMap("data",$source_id, $row['_id']->__toString());
            }
        }
         
        //复制统计信息
        $cursor = $this->_iDatabaseStatistics->find(array('formId'=>$formInfo['_id']->__toString()));
        while ($cursor->hasNext()) {
            $row = $cursor->getNext();
            unset($row['_id']);
             
            $row['formId']     = $formId;
            $row['createTime'] = new MongoDate();
            $this->_iDatabaseStatistics->insert($row);
    
    
        }
         
        //复制快捷输入
        $cursor = $this->_iDatabaseQuickInput->find(array('formId'=>$formInfo['_id']->__toString()));
        while ($cursor->hasNext()) {
            $row = $cursor->getNext();
            $source_id = $row['_id']->__toString();
            unset($row['_id']);
            	
            $row['formId']     = $formId;
            $row['createTime'] = new MongoDate();
            $this->_iDatabaseQuickInput->insert($row);
        }
        return array('newFormID'=>$formId);
    }
    
    private function getProjectItems($privileges = array(), $query = array(), $checked = 0, $expanded = 0, $editabled = 1, $viewexcluded = 0)
    {
        $query = array_merge($query, array(
            '__REMOVED__' => false
        ));
        $cursor = $this->_project->find($query);
        $cursor->sort(array(
            '__CREATE_TIME__' => - 1
        ));
        if ($cursor->count() == 0)
            return false;
        $datas = array();
        while ($cursor->hasNext()) {
            $row = $cursor->getNext();
            $data = array();
            $data['_id'] = $row['_id'];
            $data['name'] = $row['name'];
            $data['expanded'] = $expanded;
            $data['leaf'] = true;
            $data['checked'] = in_array($row['_id'], $privileges) || $checked;
            $children = $this->getFormItems($privileges, $row['_id']->__toString(), $checked, $expanded, $editabled, $viewexcluded);
            if ($children != false) {
                $data['children'] = $children;
                $data['leaf'] = false;
            }
            $datas[] = $data;
        }
        return $datas;
    }

    private function getFormItems($privileges = array(), $projectId = '', $checked = 0, $expanded = 0, $editabled = 1, $viewexcluded = 0)
    {
        $sort = array(
            'orderBy' => 1,
            '_id' => - 1
        );
        $collection = $this->model('Idatabase\Model\Collection');
        $query = array(
            'project_id' => $projectId
        );
        $cursor = $collection->find($query);
        $cursor->sort($sort);
        if ($cursor->count() == 0)
            return false;
        $datas = array();
        while ($cursor->hasNext()) {
            $row = $cursor->getNext();
            $data = array();
            $data['_id'] = $row['_id'];
            $data['name'] = $row['name'];
            $data['expanded'] = $expanded;
            $data['leaf'] = true;
            $data['checked'] = in_array($row['_id'], $privileges) || $checked;
            if (! $editabled) {
                if ($data['checked'] != true) {
                    continue;
                }
            }
            $children = false;
            if ($children != false) {
                $data['children'] = $children;
                $data['leaf'] = false;
            }
            $datas[] = $data;
        }
        return $datas;
    }

    /**
     * 检测一个项目是否存在，根据名称和编号
     *
     * @param string $info            
     * @return boolean
     */
    private function checkProjectNameExist($info)
    {
        $info = $this->_project->findOne(array(
            'name' => $info
        ));
        
        if ($info == null) {
            return false;
        }
        return true;
    }

    private function checkProjectSnExist($info)
    {
        $info = $this->_project->findOne(array(
            'sn' => $info
        ));
        
        if ($info == null) {
            return false;
        }
        return true;
    }

    private function getAcl()
    {
        $_SESSION['acl']['admin'] = false;
        $_SESSION['acl']['project'] = array();
        $_SESSION['acl']['collection'] = array();
        
        if (isset($_SESSION['account']['role']) && ! in_array($_SESSION['account']['role'], array(
            'root',
            'admin'
        ), true)) {
            $cursor = $this->_acl->find(array(
                'username' => $_SESSION['account']['username']
            ));
            while ($cursor->hasNext()) {
                $row = $cursor->getNext();
                $_SESSION['acl']['project'][] = $row['project_id'];
                $_SESSION['acl']['collection'] = array_merge($_SESSION['acl']['collection'], $row['collection_ids']);
            }
        } else {
            $_SESSION['acl']['admin'] = true;
        }
    }
}
