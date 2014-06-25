<?php
namespace User\Model;

use My\Common\Model\Mongo;

class User extends Mongo
{
     
    protected $collection = SYSTEM_USER;
	

    /**
     * 检测一个项目是否存在，根据名称和编号
     *
     * @param string $info
     * @return boolean
     */
    private function checkUserNameExist($info)
    {
    	$info = $this->findOne(array(
    			'name' => $info
    	));
    
    	if ($info == null) {
    		return false;
    	}
    	return true;
    }
    
    public function getStructure()
    {
    	$row=array();
    	$row ['cdnUrl']= "";
    	$row ['field']= "username";
    	$row ['filter']= 0;
    	$row ['isBoxSelect']= false;
    	$row ['isFatherField']= false;
    	$row ['isLinkageMenu']= false;
    	$row ['isQuick']= false;
    	$row ['label']= "用户名";
    	$row ['linkageClearValueField']= "";
    	$row ['linkageSetValueField']= "";
    	$row ['main']= true;
    	$row ['orderBy']= 0;
    	$row ['quickTargetCollection']= "";
    	$row ['required']= false;
    	$row ['rshCollection']= "";
    	$row ['rshCollectionDisplayField']= "";
    	$row ['rshCollectionFatherField']= "";
    	$row ['rshCollectionValueField']= "";
    	$row ['rshKey']= false;
    	$row ['rshSearchCondition']= "";
    	$row ['rshType']= "combobox";
    	$row ['rshValue']= true;
    	$row ['searchable']= true;
    	$row ['showImage']= false;
    	$row ['type']= "textfield";
    	$row ['xTemplate']= "";
    	$rst[] = $row;
    	 
    	$row ['cdnUrl']="";
    	$row ['field']="password";
    	$row ['filter']=0;
    	$row ['isBoxSelect']=false;
    	$row ['isFatherField']=false;
    	$row ['isLinkageMenu']=false;
    	$row ['isQuick']=false;
    	$row ['label']="密码(sha1加密)";
    	$row ['linkageClearValueField']="";
    	$row ['linkageSetValueField']="";
    	$row ['main']=true;
    	$row ['orderBy']=1;
    	$row ['quickTargetCollection']="";
    	$row ['required']=false;
    	$row ['rshCollection']="";
    	$row ['rshCollectionDisplayField']="";
    	$row ['rshCollectionFatherField']="";
    	$row ['rshCollectionValueField']="";
    	$row ['rshKey']=false;
    	$row ['rshSearchCondition']="";
    	$row ['rshType']="combobox";
    	$row ['rshValue']=false;
    	$row ['searchable']=true;
    	$row ['showImage']=false;
    	$row ['type']="sha1field";
    	$row ['xTemplate']="";
    	$rst[] = $row;
    	
    	$row ['cdnUrl']= "";
    	$row ['field']= "isProfessional";
    	$row ['filter']= 0;
    	$row ['isBoxSelect']= false;
    	$row ['isFatherField']= false;
    	$row ['isLinkageMenu']= false;
    	$row ['isQuick']= false;
    	$row ['label']= "是否专业人员";
    	$row ['linkageClearValueField']= "";
    	$row ['linkageSetValueField']= "";
    	$row ['main']= true;
    	$row ['orderBy']= 2;
    	$row ['quickTargetCollection']= "";
    	$row ['required']= false;
    	$row ['rshCollection']= "";
    	$row ['rshKey']= false;
    	$row ['rshSearchCondition']= "";
    	$row ['rshType']= "combobox";
    	$row ['rshValue']= false;
    	$row ['searchable']= true;
    	$row ['showImage']= false;
    	$row ['type']= "boolfield";
    	$row ['xTemplate']= "";
    	$rst[] = $row;
    	
    	$row ['cdnUrl']= "";
    	$row ['field']= "active";
    	$row ['filter']= 0;
    	$row ['isBoxSelect']= false;
    	$row ['isFatherField']= false;
    	$row ['isLinkageMenu']= false;
    	$row ['isQuick']= false;
    	$row ['label']= "是否激活";
    	$row ['linkageClearValueField']= "";
    	$row ['linkageSetValueField']= "";
    	$row ['main']= true;
    	$row ['orderBy']= 3;
    	$row ['quickTargetCollection']= "";
    	$row ['required']= false;
    	$row ['rshCollection']= "";
    	$row ['rshKey']= false;
    	$row ['rshSearchCondition']= "";
    	$row ['rshType']= "combobox";
    	$row ['rshValue']= false;
    	$row ['searchable']= true;
    	$row ['showImage']= false;
    	$row ['type']= "boolfield";
    	$row ['xTemplate']= "";
    	$rst[] = $row;
    	
    	$row ['cdnUrl']= "";
    	$row ['field']= "expire";
    	$row ['filter']= 0;
    	$row ['isBoxSelect']= false;
    	$row ['isFatherField']= false;
    	$row ['isLinkageMenu']= false;
    	$row ['isQuick']= false;
    	$row ['label']= "过期时间";
    	$row ['linkageClearValueField']= "";
    	$row ['linkageSetValueField']= "";
    	$row ['main']= true;
    	$row ['orderBy']= 4;
    	$row ['quickTargetCollection']= "";
    	$row ['required']= false;
    	$row ['rshCollection']= "";
    	$row ['rshCollectionDisplayField']= "";
    	$row ['rshCollectionFatherField']= "";
    	$row ['rshCollectionValueField']= "";
    	$row ['rshKey']= false;
    	$row ['rshSearchCondition']= "";
    	$row ['rshType']= "combobox";
    	$row ['rshValue']= false;
    	$row ['searchable']= true;
    	$row ['showImage']= false;
    	$row ['type']= "datefield";
    	$row ['xTemplate']= "";
    	$rst[] = $row;
    	
    	$row ['cdnUrl']= "";
    	$row ['field']= "role";
    	$row ['filter']= 0;
    	$row ['isBoxSelect']= false;
    	$row ['isFatherField']= false;
    	$row ['isLinkageMenu']= false;
    	$row ['isQuick']= false;
    	$row ['label']= "角色";
    	$row ['linkageClearValueField']= "";
    	$row ['linkageSetValueField']= "";
    	$row ['main']= true;
    	$row ['orderBy']= 5;
    	$row ['quickTargetCollection']= "";
    	$row ['required']= false;
    	$row ['rshCollection']= "system_role";
    	$row ['rshCollectionDisplayField']= "desc";
    	$row ['rshCollectionFatherField']= "";
    	$row ['rshCollectionValueField']= "role";
    	$row ['rshKey']= false;
    	$row ['rshSearchCondition']= "";
    	$row ['rshType']= "combobox";
    	$row ['rshValue']= false;
    	$row ['searchable']= true;
    	$row ['showImage']= false;
    	$row ['type']= "textfield";
    	$row ['xTemplate']= "";
    	$rst[] = $row;
    	
    	$row ['cdnUrl']= "";
    	$row ['field']= "name";
    	$row ['filter']= 0;
    	$row ['isBoxSelect']= false;
    	$row ['isFatherField']= false;
    	$row ['isLinkageMenu']= false;
    	$row ['isQuick']= false;
    	$row ['label']= "姓名";
    	$row ['linkageClearValueField']= "";
    	$row ['linkageSetValueField']= "";
    	$row ['main']= true;
    	$row ['orderBy']= 6;
    	$row ['quickTargetCollection']= "";
    	$row ['required']= true;
    	$row ['rshCollection']= "";
    	$row ['rshCollectionDisplayField']= "";
    	$row ['rshCollectionFatherField']= "";
    	$row ['rshCollectionValueField']= "";
    	$row ['rshKey']= true;
    	$row ['rshSearchCondition']= "";
    	$row ['rshType']= "combobox";
    	$row ['rshValue']= false;
    	$row ['searchable']= true;
    	$row ['showImage']= false;
    	$row ['type']= "textfield";
    	$row ['xTemplate']= "";
    	$rst[] = $row;
    	
    	$row ['cdnUrl']= "";
    	$row ['field']= "mobile";
    	$row ['filter']= 0;
    	$row ['isBoxSelect']= false;
    	$row ['isFatherField']= false;
    	$row ['isLinkageMenu']= false;
    	$row ['isQuick']= false;
    	$row ['label']= "手机";
    	$row ['linkageClearValueField']= "";
    	$row ['linkageSetValueField']= "";
    	$row ['main']= true;
    	$row ['orderBy']= 7;
    	$row ['quickTargetCollection']= "";
    	$row ['required']= false;
    	$row ['rshCollection']= "";
    	$row ['rshKey']= false;
    	$row ['rshSearchCondition']= "";
    	$row ['rshType']= "combobox";
    	$row ['rshValue']= false;
    	$row ['searchable']= true;
    	$row ['showImage']= false;
    	$row ['type']= "textfield";
    	$row ['xTemplate']= "";
    	$rst[] = $row;
    	
    	$row ['cdnUrl']= "";
    	$row ['field']= "email";
    	$row ['filter']= 0;
    	$row ['isBoxSelect']= false;
    	$row ['isFatherField']= false;
    	$row ['isLinkageMenu']= false;
    	$row ['isQuick']= false;
    	$row ['label']= "电子邮箱";
    	$row ['linkageClearValueField']= "";
    	$row ['linkageSetValueField']= "";
    	$row ['main']= true;
    	$row ['orderBy']= 8;
    	$row ['quickTargetCollection']= "";
    	$row ['required']= false;
    	$row ['rshCollection']= "";
    	$row ['rshKey']= false;
    	$row ['rshSearchCondition']= "";
    	$row ['rshType']= "combobox";
    	$row ['rshValue']= false;
    	$row ['searchable']= true;
    	$row ['showImage']= false;
    	$row ['type']= "textfield";
    	$row ['xTemplate']= "";
    	$rst[] = $row;
    	
    	$row ['cdnUrl']= "";
    	$row ['field']= "verifyEmail";
    	$row ['filter']= 0;
    	$row ['isBoxSelect']= false;
    	$row ['isFatherField']= false;
    	$row ['isLinkageMenu']= false;
    	$row ['isQuick']= false;
    	$row ['label']= "邮箱验证";
    	$row ['linkageClearValueField']= "";
    	$row ['linkageSetValueField']= "";
    	$row ['main']= true;
    	$row ['orderBy']= 9;
    	$row ['quickTargetCollection']= "";
    	$row ['required']= false;
    	$row ['rshCollection']= "";
    	$row ['rshKey']= false;
    	$row ['rshSearchCondition']= "";
    	$row ['rshType']= "combobox";
    	$row ['rshValue']= false;
    	$row ['searchable']= true;
    	$row ['showImage']= false;
    	$row ['type']= "boolfield";
    	$row ['xTemplate']= "";
    	$rst[] = $row;
    	
    	return $rst;
    }
  
    
}