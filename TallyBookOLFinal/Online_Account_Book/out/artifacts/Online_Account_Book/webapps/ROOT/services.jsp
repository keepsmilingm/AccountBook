<%@page import="java.util.*"%>
<%
Map dataSet=(Map)application.getAttribute("dataSet");
if(null==dataSet){
    dataSet=new HashMap();
    application.setAttribute("dataSet",dataSet);
}
String cmd=request.getParameter("cmd");
String phone=request.getParameter("phone");
String password=request.getParameter("password");
String gender=request.getParameter("gender");
String hobbies=request.getParameter("hobbies");
String location=request.getParameter("location");
System.out.println("cmd="+cmd);
System.out.println("phone="+phone);
System.out.println("password="+password);
System.out.println("gender="+gender);
System.out.println("hobbies="+hobbies);
System.out.println("location="+location);
if("register".equals(cmd)){
    String state="FAIL";
    Map item=new HashMap();
    item.put("phone",phone);
    item.put("password",password);
    item.put("gender",gender);
    item.put("hobbies",hobbies);
    item.put("location",location);
    dataSet.put(phone,item);
    state="SUCCESS";
    out.print(state);
}
else if("login".equals(cmd)){
    String state="FAIL";
    for(Object k:dataSet.keySet()){
        System.out.println("key="+k);
    }
    System.out.println(dataSet.keySet().contains(phone));
    if(dataSet.keySet().contains(phone)){
        Map item=(Map)dataSet.get(phone);
        String pwd=(String)item.get("password");
        System.out.println("pwd="+pwd);
        if(null==pwd){
            pwd="";
        }
        if(pwd.equals(password)){
            state="SUCCESS";
        }
    }
    out.print(state);
}
else if("query".equals(cmd)){
    String datas="NONE";
    if(dataSet.keySet().contains(phone)){
        datas=phone+",";
        Map item=(Map)dataSet.get(phone);
        String data=(String)item.get("password");
        datas+=data==null?"":data+",";
        data=(String)item.get("gender");
        datas+=data==null?"":data+",";
        data=(String)item.get("hobbies");
        datas+=data==null?"":data+",";
        data=(String)item.get("location");
        datas+=data==null?"":data;
    }
    out.print(datas);
}
else{
    out.print("UNKNOWN_COMMAND");
}
%>