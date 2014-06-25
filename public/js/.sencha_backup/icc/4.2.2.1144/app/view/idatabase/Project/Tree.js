Ext.define('icc.view.idatabase.Project.Tree', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.idatabaseProjectTree',
	//title : '复制源',
	collapsible : false,
	split : true,
	width : 300,
	minSize : 300,
	autoLoad:false,
	rootVisible : false,
	root : {
	},
	autoScroll : true,	
	initComponent:function() {		
		var projectId=this.__PROJECT_ID__;
		var extraParams = {'projectId':projectId};
		Ext.apply(this, {		
            store: new Ext.data.TreeStore({
                model: 'icc.model.idatabase.TreeItem',                
				lazyFill: true,
                proxy: {
                    type: 'ajax',
                    url: '/idatabase/project/tree',
					extraParams:extraParams
                }
            }),			
			columns : [{
				xtype: 'treecolumn', //this is so we know which column will show the tree
				text: '项目名称',
				flex: 1,
				width : 60,
				sortable: true,
				dataIndex: 'name'
			}],			
			plugins: [{
				ptype: 'bufferedrenderer'
			}],
			listeners:{
				checkchange :function(node,checked){
					treecheck(node,checked);
				}	
			}
			
        });
		
		this.callParent();
	}
});

function treecheck(node,checked ){
	node.expand();  
    node.checked = checked;  
    node.eachChild(function (child) {
    	child.set('checked', checked);  
    	treecheck(child,checked);
    }); 
}