package utils.resources;

import javax.servlet.ServletOutputStream;
import java.net.URISyntaxException;
import java.nio.file.Paths;

public class ResourceOps {

    public static String resourceUnsafe(String name) {
        try {
            return Paths
                    .get(ResourceOps.class
                            .getClassLoader()
                            .getResource(name)
                            .toURI())
                    .toString();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

}
