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
        try {
            SpringApplication.run(MismatchResolverApplication.class, args);
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
    }
}
