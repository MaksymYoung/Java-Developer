package utils.exceptions;

public class InvalidLikeDataException extends Exception {
    public InvalidLikeDataException() {
        super("Invalid like data received.");
    }
}