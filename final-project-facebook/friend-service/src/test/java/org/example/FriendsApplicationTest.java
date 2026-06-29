package org.example;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import org.junit.jupiter.api.Disabled;

@Disabled
/**
 * Unit test for simple App.
 */
public class FriendsApplicationTest
    extends TestCase
{
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public FriendsApplicationTest( String testName )
    {
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite()
    {
        return new TestSuite( FriendsApplicationTest.class );
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp()
    {
        assertTrue( true );
    }
}
