package edu.eci.arsw.cinema.controllers;

import edu.eci.arsw.cinema.model.Seat;
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
    private ConcurrentHashMap<String, CopyOnWriteArrayList<Seat>> seats = new ConcurrentHashMap<>();

    @MessageMapping("/buyticket.{id}")
    public void handlePointEvent(Seat seat, @DestinationVariable String id) throws Exception {
        if (seats.containsKey(id)) {
            seats.get(id).add(seat);
        }
        else {
            CopyOnWriteArrayList nueva =new CopyOnWriteArrayList<Seat>();
            nueva.add(seat);
            seats.put(id,nueva);
        }
        msgt.convertAndSend("/topic/buyticket."+id, seat);

    }
}
