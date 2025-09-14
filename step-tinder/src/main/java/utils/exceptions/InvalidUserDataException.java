package utils.exceptions;

public class InvalidUserDataException extends Exception {
    public InvalidUserDataException() {
        super("Invalid user data received.");
    }
}
