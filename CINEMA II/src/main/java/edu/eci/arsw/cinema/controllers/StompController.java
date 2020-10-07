package edu.eci.arsw.cinema.controllers;

import edu.eci.arsw.cinema.model.Seat;
import edu.eci.arsw.cinema.services.CinemaServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Controller
public class StompController {

    @Autowired
    SimpMessagingTemplate msgt;

    @Autowired
    CinemaServices services;

    private ConcurrentHashMap<String, CopyOnWriteArrayList<Seat>> seats = new ConcurrentHashMap<>();

    @MessageMapping("/buyticket.{cinemaName}.{functionDate}.{movieName}")
    public void handleBuyEvent(Seat st, @DestinationVariable String cinemaName, @DestinationVariable String functionDate, @DestinationVariable String movieName) throws Exception {
        System.out.println("Nuevo asiento recibido en el servidor!:" + st);

        services.buyTicket(st.getRow(),st.getCol(),cinemaName, functionDate,movieName);
        msgt.convertAndSend("/topic/buyticket." + cinemaName + "." + functionDate + "." + movieName, st);
    }
}
