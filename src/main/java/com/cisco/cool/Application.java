/**
 * 
 */
package com.cisco.cool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

/**
 * Application.java - <Describe the intent of this class>
 * @author K Pandian (pathimoo)
 * Nov 26, 2018
 *
 */


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
