# 醍醐灌顶的文章：https://zhuanlan.zhihu.com/p/45107365
    {首次使用类的时候},【类会被加载】, 静态代码块会执行。 
    
    ps~ T类的Class<T>对象是存在堆区的，Class<T>是类的类对象
    ps~ Class<T>对象是类加载的最终产品,类的数据结构(元数据):类的方法代码，变量名，方法名，访问权限，返回值等等才是在方法区
    
    
    静态代码块在【类被加载的时候】执行,也就是说各个静态代码块只会执行一次
    
    
# 何为首次使用类:
    
#### 1:第一次创建对象时
      new StaticDemo()
    
#### 2: 调用该类的静态方法时(静态代码块优先静态方法执行)  
      public class StaticDemo {
          public static void main(String[] args) {
              Demo1.StaticMethod();
          }
      }
      
      class Demo1 {
          static {
              System.out.println("Demo1 static block !");
          }
      
          public static void StaticMethod() {
              System.out.println("Static Method !");
          }
      }
      结果：
      Demo1 static block ! 
      
      Static Method !
#### 3.使用该类的非常量静态字段（加final不行,加final为常量）
      public class StaticDemo {
          public static void main(String[] args) {
              Demo1.a=0;
          }
      }
      
      class Demo1 {
          public static int a;
          static {
              System.out.println("Demo1 static block !");
          }
      }
      结果:
      Demo1 static block !
#### 4.使用反射方法时
     public class StaticDemo {
         public static void main(String[] args) {
             try {
                 //jdbc4.0之前持久化框架都是这样调用数据库驱动
                 //驱动里面都有静态代码块,静态代码块会将驱动注册到DriverManager里面
                 Class.forName("org.Demo1");
             } catch (ClassNotFoundException e) {
                 e.printStackTrace();
             }
         }
     }
     
     class Demo1 {
         static {
             System.out.println("Demo1 static block !");
         }
     }
    结果:
    Demo1 static block ! 
    
#### 5.第一次实例化该类的子类（首先执行父类静态内容，然后执行子类静态内容，然后依次执行父类构造函数，子类构造函数,先父亲后儿子） 
    public class StaticDemo {
        public static void main(String[] args) {
            new Demo2();
        }
    }
    
    class Demo1 {
        static {
            System.out.println("Demo1 static block !");
        }
    
        Demo1() {
            System.out.println("Demo1 !");
        }
    }
    
    class Demo2 extends Demo1 {
        static {
            System.out.println("Demo2 static block !");
        }
    
        Demo2() {
            System.out.println("Demo2 !");
        }
    }   
    结果：  
    Demo1 static block !  
    
    Demo2 static block ! 
    
    Demo1 !  
    
    Demo2 ! 
    
#### ps:静态块的执行顺序是按照静态块所定义的顺序决定的，即先定义先执行    