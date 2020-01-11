import java.util.Random;
public class IgniteSimulator {
    public static void main(String[] args) {
        //wbuffs 10+3+5 crit, 5% dmg (avg),
        for (int n = 1; n < 4; n++) { // loop for results
            for (int mageNumber = 1; mageNumber < 10; mageNumber++) { // loop for table, for number of mages
                long mageSpellDmg = 679 + 225; // pre raid 446, pre aq 621, pre nax 652, nax 679
                long mageCritChance = 23 + 7 + 18; //+6 is from talents, 1 is from bril. wiz. oil , pre raid 10, pre aq 11, pre nax 15, nax 23
                long mageMissChance = 1; // pre raid 5
                long fightLenght = 0;
                long fireballDmg = 0;
                Random randomRoll = new Random();
                long totalDmg = 0;
                long igniteCounter = 0; // current ignite stack
                long igniteDmg = 0; // current ignite total DMG
                long igniteDot = 0; // ignite damage happening to boss
                long igniteTotal = 0; // total damage done by ignite
                long lastCriticalTime = 0; // time of the critical strike
                long igniteStarterTimer = 0;
                long totalAdditionalDmgFromCrit = 0;
                for (fightLenght = 0; fightLenght < 12000000; fightLenght++) { // this is loop for fight 1 second is actually value 10 here
                    for (long mageIndividuals = 1; mageIndividuals < mageNumber + 1; mageIndividuals++) { // this is loop so each mage gets his roll
                        fireballDmg = 0;
                        if (fightLenght % 30 == 0) { // 30 here means 3 second, which is fireball cast time
                            long hitRoll = randomRoll.nextInt(100) + 1;
                            if (hitRoll > mageMissChance) { // this means hit has happened
                                fireballDmg = (638 + mageSpellDmg) * 145 / 100; // 140/100 = 40% damage increase from 10% talent damage, 15% scorch, 10% CoE, 5% for 33% uptime of Nightfall
                                // level based resistance part, 1% for 75 reduction, 4% for 50, 15% for 25, 80% for full dmg.
                                long partialResistRoll = randomRoll.nextInt(100) + 1;
                                if (partialResistRoll == 1) {
                                    fireballDmg = fireballDmg * 25 / 100;
                                }
                                if (partialResistRoll < 5 && partialResistRoll != 1) {
                                    fireballDmg = fireballDmg * 50 / 100;
                                }
                                if (partialResistRoll < 16 && partialResistRoll > 4) {
                                    fireballDmg = fireballDmg * 75 / 100;
                                }
                                long critRoll = randomRoll.nextInt(100) + 1;
                                if (critRoll < mageCritChance) { // if spell hit and crit rolled positive we add 3/2 which is 50% bonus to damage
                                    fireballDmg = fireballDmg * 3 / 2;
                                    if (igniteCounter == 0) {
                                        igniteStarterTimer = fightLenght;
                                    }
                                    if (igniteCounter < 5) { // if Ignite stack is less then 5 add 1 more
                                        igniteCounter++;
                                        igniteDmg = igniteDmg + fireballDmg * 4 / 10;
                                    }
                                    //System.out.println(igniteCounter);
                                    lastCriticalTime = fightLenght;
                                    totalAdditionalDmgFromCrit = totalAdditionalDmgFromCrit + fireballDmg * 1 / 3; // For later 1 crit value calculation
                                }
                            }
                            //System.out.println(fireballDmg);
                            totalDmg = totalDmg + fireballDmg;
                        }
                    }
                    //System.out.println(igniteStarterTimer);
                    if ((fightLenght - igniteStarterTimer) % 20 == 0 && (fightLenght - igniteStarterTimer) != 0) { // every two seconds after ignite starter crit we check ignite
                        if (fightLenght - lastCriticalTime <= 40) { // ticking dot unless over 4 seconds since last hit has past
                            igniteDot = igniteDmg / 2;
                            igniteTotal = igniteTotal + igniteDot;
                            totalDmg = totalDmg + igniteDot;
                            //System.out.println("ignite dmg: "+igniteDot+" fight time"+fightLenght+" ignite start time"+igniteStarterTimer+" ignite counter: "+igniteCounter);
                            //System.out.println(igniteCounter);
                        }
                        if (fightLenght - lastCriticalTime > 40) { // if over 4 seconds has past since last crit than dot dmg and stack is reset
                            igniteCounter = 0;
                            igniteDmg = 0;
                            igniteDot = 0;
                        }
                    }
                }
                double ignitePercentage = (double) igniteTotal / totalDmg * 100;
                double dps = (double) totalDmg / (double) fightLenght * 10 / (double) mageNumber;
                double oneCritValueInDps = ((double) totalAdditionalDmgFromCrit + (double) igniteTotal) / (double) fightLenght * 10 / mageNumber / mageCritChance;
                if (n == 1) {
                    System.out.println(dps);
                }
                if (n == 2) {
                    System.out.println(oneCritValueInDps);
                }
                if (n == 3) {
                    System.out.println(ignitePercentage);
                }
            }
        }
    }
}