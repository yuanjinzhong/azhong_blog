# Mybatis3.5支持返回Optional

# 原理性文章
##### Mybatis的SqlSession运行原理    
    1:https://www.cnblogs.com/jian0110/p/9452592.html
##### Mybatis的MapperPoxy怎么玩的
    MapperRegistry&&MapperProxyFactory&&MapperProxy之间的关系
    
    MapperPoxy实际上是一个InvocationHandler
    MapperProxyFactory里面的newInstance方法创建Mapper接口的代理实现类
    MapperRegistry以HashMap的形式,存放Mapper接口和MapperProxyFactory代理工厂的映射
    
    1：https://zhuanlan.zhihu.com/p/74108617    
    2:   https://mp.weixin.qq.com/s?__biz=MzI1NDQ3MjQxNA==&mid=2247486856&idx=1&sn=d430be5d14d159fd36b733c83369d59a&chksm=e9c5f439deb27d2f60b69d7f09b240eb43a8b1de2d07f7511e1f1fecdf9d49df1cb7bc6e1ab5&scene=21#wechat_redirect
##### MapperProxy里面涉及的类
    1:MapperMethod
    
    2:MapperMethod{SqlCommand & MethodSignature}
    
    3：SqlCommand包含了执行方法的名称和方法类型(UNKNOWN, INSERT, UPDATE, DELETE, SELECT, FLUSH),方法类型是个枚举:SqlCommandType    
    
##### 从源码聊聊mybatis一次查询都经历了些什么
    Configuration类持有MapperRegistry
    MapperRegistry持有一个key为Mapper接口,value为MapperProxyFactory的Map:Map<Class<?>, MapperProxyFactory<?>>;
                  以及持有一个Configuration对象的引用
    MapperProxyFactory为Mapper接口代理实现类的工厂
    以上总结为:Configuration对象持有所有Mapper接口的代理实现类,即Mybatis初始化构造解析配置文件的时候,会往MapperRegistry里面的HashMap存放MapperProxyFactory,通过这个MapperProxyFactory的newInstance方法可以获取Mapper接口的代理实现类
    
    Mybatis初始化完成(配置文件解析完成时)时,MapperRegistry.knownMappers集合中的各个Mapper接口代理工厂就定下来了
    
    1:https://zhuanlan.zhihu.com/p/60687622
    
    Mybatis 执行增删改查的重点方法:org.apache.ibatis.binding.MapperMethod.execute
    
##### Mybatis中SqlSession是如何和Mapper接口建立关联的
    SqlSession接口定义了 <T> T getMapper(Class<T> type)方法,
    
    SqlSession接口的实现类DefaultSqlSession中持有ConFiguration,Configuration持有MapperRegistry
    
    DefaultSqlSession实现getMapper的方法为:利用MapperRegistry.getMapper(XXXX)方法获取Mapper接口的代理实现类
# StatementType
    public enum StatementType {
      STATEMENT, PREPARED, CALLABLE
    }
    
    1、STATEMENT:直接操作sql，不进行预编译，获取数据：$—Statement 
    2、PREPARED:预处理，参数，进行预编译，获取数据：#—–PreparedStatement:默认 
    3、CALLABLE:执行存储过程————CallableStatement 
# SqlCommandType
    public enum SqlCommandType {
      UNKNOWN, INSERT, UPDATE, DELETE, SELECT, FLUSH;
    }
    UNKNOWN 和 FLUSH 的意义?
# SqlSession
     SqlSession 实现类:DefaultSqlSession ,mybatis源码包里面的，非线程安全,切记不可以写成单列
                     :SqlSessionManager , mybatis源码包里面 ，线程安全，因为SqlSessionManager里面绑定了SqlSession和当前Thread：private final ThreadLocal<SqlSession> localSqlSession = new ThreadLocal<>();
                     :SqlSessionTemplate ,mybatis-spring包里面的,线程安全
     SqlSessionTemplate 由 Spring 事务管理器决定是否共用 SqlSession。事务内部共用 SqlSession，非事务不共用 SqlSession。同一个事务，内部存在新开线程的不共用 SqlSession    
     
###### DefaultSqlSession和SqlSessionManager之间的区别：  
        
     1、DefaultSqlSession的内部没有提供像SqlSessionManager一样通过ThreadLocal的方式来保证线程的安全性；
     
     2、SqlSessionManager是通过localSqlSession这个ThreadLocal变量，记录与当前线程绑定的SqlSession对象，供当前线程循环使用，从而避免在同一个线程多次创建SqlSession对象造成的性能损耗；
     
     3、DefaultSqlSession不是线程安全的，我们在进行原生开发的时候，需要每次为一个操作都创建一个SqlSession对象，其性能可想而知；
     
###### 为什么mybatis-spring框架中不直接使用线程安全的SqlSessionManager而是使用SqlSessionTemplate
     
     1. SqlSessionManager和SqlSessionTemplate都可以作SqlSession，并且在各自类里都对SqlSession做了动态代理。区别是SqlSessionTemplate的动态代理更高效（有SqlSession的引用计数），并且有对Spring框架的配合。动态代理的实现不容易复用，所以干脆分开，做到低耦合。

###### 为什么Mybatis DefaultSqlSession不是线程安全的
     https://www.jianshu.com/p/b1d80ca8f300 (分析的不错)
     
    
# 原生Jdbc执行过程
    作者：清幽之地
    链接：https://juejin.im/post/5c84b4515188257ea64cec43
    来源：掘金
  ``` java  
    public static void main(String[] args) throws Exception {
    
        //加载Oracle数据库驱动
        Class.forName("oracle.jdbc.driver.OracleDriver");
        
        //加载SQL Server数据库驱动
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        
        //加载MySQL 数据库驱动
        Class.forName("com.mysql.jdbc.Driver");
        
        // 以上三个Class.forName 会执行各个驱动里面的DriverManager.register驱动的逻辑，将驱动注册到jvm的方法区
    
        Connection conn = getConnection();
        String sql = "select * from user where 1=1 and id = ?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, "501440165655347200");
        ResultSet rs = stmt.executeQuery();
        while(rs.next()){
        String username = rs.getString("username");
        System.out.print("姓名: " + username);
        }
    }

```
    
* 从上面的代码来看，一次简单的数据库查询操作，可以分为几个步骤。
    
* 创建Connection连接
    
* 传入参数化查询SQL语句构建预编译对象PreparedStatement
    
* 设置参数
    
* 执行SQL
    
* 从结果集中获取数据

# Mybatis初始化流程
    待定

# java.sql.DriverManager和java.sql.Connection的关系
     通过DriverManager获取Connection
     
     DriverManager有个属性:registeredDrivers    
     private final static CopyOnWriteArrayList<DriverInfo> registeredDrivers = new CopyOnWriteArrayList<>(); 将系统中的驱动注入到这个list里面，交给DriverManager管理

# Mybatis加载数据库驱动的方式
    1:https://blog.csdn.net/u010192145/article/details/90244716 mybatis 源码系列(四) 数据库驱动Driver加载方式     
    
# Mybatis数据源 PooledDataSource &  UnpooledDataSource &  PoolState  & PooledConnection 的关系
     PooledDataSource 持有 UnpooledDataSource，靠UnpooledDataSource来getconnection， get到的connection又放到PoolState里面
     所以PoolState才是连接池,是个连接池容器
     
     PooledDataSource 持有PoolState(在属性中初始化)， PoolState亦持有PooledDataSource(构造方法初始化),组合模式 形成一对一绑定关系
     
     PooledDataSource#pushConnection 添加连接
     PooledDataSource#popConnection  池中取出连接
     
     PooledConnection 实现 InvocationHandler 使用动态代理的原因是：如下
  ``` java   
       /**
        *
        *这边使用动态代理的原因是因为 要实现池化连接
        *
        * Connection对象调用close方法时，为了不让Connection对象真正关闭，所以使用jdk的代理，如果是close方法，则将这个连接放到 PooledDataSource里面
        *
        */
       @Override
       public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
         String methodName = method.getName();
         if (CLOSE.hashCode() == methodName.hashCode() && CLOSE.equals(methodName)) {
           // 这个this 是指caller, 即ConnectionProxy
           dataSource.pushConnection(this);
           return null;
         }
         try {
           if (!Object.class.equals(method.getDeclaringClass())) {
             // issue #579 toString() should never fail
             // throw an SQLException instead of a Runtime
             checkConnection();
           }
           return method.invoke(realConnection, args);
         } catch (Throwable t) {
           throw ExceptionUtil.unwrapThrowable(t);
         }
     
       }
```
# Mybatis 用了哪些设计模式
     jdk动态代理 如：MapperProxy.class ,PooledConnection.class
     
     组合模式 如：PooledDataSource.class 与 PoolState.class 互相组合
     
     工厂模式 如：PooledDataSource.class  和 UnpooledDataSource.class 都有个对应的工厂
     
# Mybatis Spi机制加载数据库驱动 以及驱动加载流程

    阿里亦山的文章:https://blog.csdn.net/luanlouis/article/details/29850811

     1:各数据库厂商将数据库驱动交给jvm管理
     public class Driver extends NonRegisteringDriver implements java.sql.Driver {
           public Driver() throws SQLException {
           }
           static {
             try {
               DriverManager.registerDriver(new Driver());
             } catch (SQLException var1) {
               throw new RuntimeException("Can't register driver!");
             }
           }
         }
         厂家驱动里面有这段代码,我们需要手动Class.forName("org.mysql.driver") (详见这段:org.apache.ibatis.datasource.unpooled.UnpooledDataSource.initializeDriver)来执行上述代码块，将驱动注册到DriverManager
         
         但是jdbc4.0之后就不需要了，4.0之后的DriverManager的静态代码块里面有了spi 机制，只要执行DriverManager的静态方法,静态代码块就会执行,且是在静态方法前面执行
         
         详见下文
         
         
      2:spi机制
      
      详见这篇文章:http://benjaminwhx.com/2018/06/20/%E8%B0%88%E8%B0%88Java%E7%9A%84SPI%E6%9C%BA%E5%88%B6/
      
     详见代码:public class DriverManager {
     
           /**
             * Load the initial JDBC drivers by checking the System property
             * jdbc.properties and then use the {@code ServiceLoader} mechanism
             */
            static {
                loadInitialDrivers();
                println("JDBC DriverManager initialized");
            }

     }

    DriverManager利用spi机制加载mysql的驱动实际是破坏了双亲委派模型
    
    因为DriverManager是通过Bootstrap ClassLoader加载进来的，而com.mysql.jdbc.Driver是通过Application ClassLoader 加载classpath的JAR包加载进来的。要想通过DriverManager，必须破坏双亲委派模型才能拿到。
    
# Mybatis拦截器
    mybatis拦截器可以拦截任意类型的 任意方法，不局限于拦截mybatis里面的方法，详见：org.apache.ibatis.plugin.PluginTest#mapPluginShouldInterceptGet
    
    但是mybatis 本身在使用它的拦截器的时候只让Executor、ParameterHandler、ResultSetHandler、StatementHandler
    这四个接口的实例对象和拦截器绑定(mybatis里面只要这4个接口实例的方法会被代理)
    
    InterceptorChain:拦截器链
    当调用pluginAll(target)方法时，target对象会被链上的拦截器一层层的代理
    如果我用P表示代理，生成第一次代理为P(target)，生成第二次代理为P(P(target))，生成第三次代理为P(P(P(target)))，不断嵌套下去，所以后加的拦截器会先执行
# 自定义Mybatis拦截器实现修改用户角色时记录用户修改前和修改后的角色

```
   实现不了
```
         
     
     


      