package com.diunipisocc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

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
