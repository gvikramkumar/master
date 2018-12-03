/**
 * 
 */
package com.cisco.cool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
//import org.springframework.boot.autoconfigure.mongo.MongoReactiveAutoConfiguration;

/**
 * Application.java - <Describe the intent of this class>
 * @author K Pandian (pathimoo)
 * Nov 26, 2018
 *
 */
 
@EnableAutoConfiguration(exclude = { DataSourceAutoConfiguration.class })
@SpringBootApplication
public class Application extends SpringBootServletInitializer{

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
        SpringApplication.run(Application.class, args);

	}

 	@Override
 	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
 	    return application.sources(Application.class);
 	}
	
}
