package com.esg.esg_reporting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.AuditEvent;
import com.esg.esg_reporting.repository.AuditEventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuditEventService {

    private final AuditEventRepository repository;

    public AuditEvent saveAuditEvent(AuditEvent event) {
        return repository.save(event);
    }

    public List<AuditEvent> getAllAuditEvents() {
        return repository.findAll();
    }

    public AuditEvent getAuditEventById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit event not found"));
    }
}