package com.esg.esg_reporting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.esg.esg_reporting.entity.AuditEvent;
import com.esg.esg_reporting.service.AuditEventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/audit-events")
@RequiredArgsConstructor
public class AuditEventController {

    private final AuditEventService service;

    @GetMapping
    public List<AuditEvent> getAllAuditEvents() {
        return service.getAllAuditEvents();
    }

    @GetMapping("/{id}")
    public AuditEvent getAuditEventById(@PathVariable Long id) {
        return service.getAuditEventById(id);
    }
}