//jcomeau@aspire:/tmp$ cat test.java; javac test.java; java test
import java.awt.event.*;
import java.awt.Robot;
public class test {
 public static void main(String args[]) {
  Robot bot = null;
  try {
   bot = new Robot();
  } catch (Exception failed) {
   System.err.println("Failed instantiating Robot: " + failed);
  }
  int mask = InputEvent.BUTTON3_DOWN_MASK;
  System.out.println("I am coming here");
  int x=Integer.parseInt(args[0]);
  int y=Integer.parseInt(args[1]);
  bot.mouseMove(x, y);
  bot.mousePress(mask);
  bot.mouseRelease(mask);
 }
}