package com.idm.e2e.repositories;

import com.idm.e2e.entities.NodeLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<NodeLogEntity, Long> {
}
