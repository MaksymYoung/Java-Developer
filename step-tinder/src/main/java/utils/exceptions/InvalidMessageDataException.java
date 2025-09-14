package utils.exceptions;

public class InvalidMessageDataException extends Exception {
    public InvalidMessageDataException() {
        super("Invalid like data received.");
    }
}
