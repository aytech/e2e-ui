package com.idm.e2e.repositories;

import com.idm.e2e.entities.SystemVariableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SystemVariableRepository extends JpaRepository<SystemVariableEntity, Long> {

    @Query("select Variable from SystemVariableEntity Variable where Variable.key = :key")
    Optional<SystemVariableEntity> findByKey(@Param("key") String key);
}
