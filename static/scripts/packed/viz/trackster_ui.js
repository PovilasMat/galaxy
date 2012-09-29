define(["base","libs/underscore","viz/trackster/slotting","viz/trackster/painters","viz/trackster/tracks"],function(f,c,g,d,b){var a=b.object_from_template;var e=f.Base.extend({initialize:function(h){this.baseURL=h},createButtonMenu:function(){var h=this,j=create_icon_buttons_menu([{icon_class:"plus-button",title:"Add tracks",on_click:function(){b.add_datasets(add_datasets_url,add_track_async_url,function(k){c.each(k,function(l){view.add_drawable(a(l,view,view))})})}},{icon_class:"block--plus",title:"Add group",on_click:function(){view.add_drawable(new b.DrawableGroup(view,view,{name:"New Group"}))}},{icon_class:"bookmarks",title:"Bookmarks",on_click:function(){parent.force_right_panel(($("div#right").css("right")=="0px"?"hide":"show"))}},{icon_class:"globe",title:"Circster",on_click:function(){window.location=h.baseURL+"visualization/circster?id="+view.vis_id}},{icon_class:"disk--arrow",title:"Save",on_click:function(){show_modal("Saving...","progress");var k=[];$(".bookmark").each(function(){k.push({position:$(this).children(".position").text(),annotation:$(this).children(".annotation").text()})});var l=(view.overview_drawable?view.overview_drawable.name:null),m={id:view.vis_id,title:view.name,dbkey:view.dbkey,type:"trackster",datasets:view.to_dict(),viewport:{chrom:view.chrom,start:view.low,end:view.high,overview:l},bookmarks:k};$.ajax({url:galaxy_paths.get("visualization_url"),type:"POST",dataType:"json",data:{vis_json:JSON.stringify(m)}}).success(function(n){hide_modal();view.vis_id=n.vis_id;view.has_changes=false;window.history.pushState({},"",n.url+window.location.hash)}).error(function(){show_modal("Could Not Save","Could not save visualization. Please try again later.",{Close:hide_modal})})}},{icon_class:"cross-circle",title:"Close",on_click:function(){window.location=h.baseURL+"visualization/list"}}],{tooltip_config:{placement:"bottom"}});this.buttonMenu=j;return j},add_bookmarks:function(){var h=this,j=this.baseURL;show_modal("Select dataset for new bookmarks","progress");$.ajax({url:this.baseURL+"/visualization/list_histories",data:{"f-dbkey":view.dbkey},error:function(){alert("Grid failed")},success:function(k){show_modal("Select dataset for new bookmarks",k,{Cancel:function(){hide_modal()},Insert:function(){$("input[name=id]:checked,input[name=ldda_ids]:checked").first().each(function(){var l,m=$(this).val();if($(this).attr("name")==="id"){l={hda_id:m}}else{l={ldda_id:m}}$.ajax({url:this.baseURL+"/visualization/bookmarks_from_dataset",data:l,dataType:"json"}).then(function(n){for(i=0;i<n.data.length;i++){var o=n.data[i];h.add_bookmark(o[0],o[1])}})});hide_modal()}})}})},add_bookmark:function(m,k,h){var o=$("#bookmarks-container"),q=$("<div/>").addClass("bookmark").appendTo(o);var r=$("<div/>").addClass("position").appendTo(q),n=$("<a href=''/>").text(m).appendTo(r).click(function(){view.go_to(m);return false}),l=$("<div/>").text(k).appendTo(q);if(h){var p=$("<div/>").addClass("delete-icon-container").prependTo(q).click(function(){q.slideUp("fast");q.remove();view.has_changes=true;return false}),j=$("<a href=''/>").addClass("icon-button delete").appendTo(p);l.make_text_editable({num_rows:3,use_textarea:true,help_text:"Edit bookmark note"}).addClass("annotation")}view.has_changes=true;return q},create_visualization:function(n,h,m,o,l){var k=this,j=new b.View(n);j.editor=true;$.when(j.load_chroms_deferred).then(function(){if(h){var x=h.chrom,p=h.start,u=h.end,r=h.overview;if(x&&(p!==undefined)&&u){j.change_chrom(x,p,u)}}if(m){var s,q,t;for(var v=0;v<m.length;v++){j.add_drawable(a(m[v],j,j))}}j.update_intro_div();var y;for(var v=0;v<j.drawables.length;v++){if(j.drawables[v].name===r){j.set_overview(j.drawables[v]);break}}if(o){var w;for(var v=0;v<o.length;v++){w=o[v];k.add_bookmark(w.position,w.annotation,l)}}j.has_changes=false});return j},init_keyboard_nav:function(h){$(document).keydown(function(j){if($(j.srcElement).is(":input")){return}switch(j.which){case 37:h.move_fraction(0.25);break;case 38:var k=Math.round(h.viewport_container.height()/15);h.viewport_container.scrollTop(h.viewport_container.scrollTop()-20);break;case 39:h.move_fraction(-0.25);break;case 40:var k=Math.round(h.viewport_container.height()/15);h.viewport_container.scrollTop(h.viewport_container.scrollTop()+20);break}})}});return{object_from_template:a,TracksterUI:e}});