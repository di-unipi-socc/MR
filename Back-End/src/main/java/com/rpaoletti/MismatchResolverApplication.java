package com.rpaoletti;

import com.rpaoletti.routeparser.model.NamedType;
import com.rpaoletti.routeparser.utils.Utils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class MismatchResolverApplication {

    public static void main(String[] args) {
/*
        NamedType t1 = new NamedType(
                "t1",
                null,
                List.of(
                        new NamedType("name","string", null, "simple"),
                        new NamedType("job","string", null, "simple"),
                        new NamedType("income","double", null, "simple"),
                        new NamedType("age","double", null, "simple")
                ),
                "composite"
        );

        NamedType t2 = new NamedType(
                "t2",
                "empty",
                List.of(
                        new NamedType("name","string", null, "simple"),
                        new NamedType("occupation", null, List.of(
                                new NamedType("job","string", null, "simple"),
                                new NamedType("income","double", null, "simple")
                        ), "composite"),
                        new NamedType("age","double", null, "simple")
                ),
                "composite"
        );

        System.out.println(Utils.isAdaptable(t1,t2));*/

        try {
            SpringApplication.run(MismatchResolverApplication.class, args);
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
    }
}
